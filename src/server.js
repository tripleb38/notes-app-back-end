require("dotenv").config();

const Hapi = require("@hapi/hapi");
const notes = require("./api/notes");
const NotesService = require("./services/postgres/NotesService");
const NotesValidator = require("./validator/notes");
const ClientError = require("./exceptions/ClientError"); // pastikan ini diimpor

const init = async () => {
  const notesService = new NotesService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register({
    plugin: notes,
    options: {
      service: notesService,
      validator: NotesValidator,
    },
  });

  // Extension function untuk menangani ClientError
  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    // Penanganan error dari kelas ClientError
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    // Biarkan respons lanjut ke tahap berikutnya
    return h.continue;
  });
r berjalan pada ${server.info.uri}`);
};

init();
