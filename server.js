const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('koa2-cors');

const app = new Koa();

app.use(koaBody({
  urlencoded: true,
  multipart: true,
  text: true,
  json: true,
}));

app.use(
  cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
  }),
);

let tickets = [
  {
    id: 1,
    name: 'Установить обновление КВ-ХХХ',
    description: 'Вышло критическое обновление для Windows, нужно поставить обновления в следующем приоритете: 1. Сервера 2. Рабочие станции',
    status: true,
    created: 1612543928473,
  },
  {
    id: 2,
    name: 'Переустановить Windows, ПК-Hall24',
    description: 'Переустановить Windows, ПК-Hall24',
    status: false,
    created: 1620579128473,
  },
];

app.use(async (ctx) => {
  const { method } = ctx.request.query;

  let ticket;
  let inputData;

  switch (method) {
    case 'allTickets':
      ctx.response.body = tickets.map((item) => ({
        id: item.id, name: item.name, status: item.status, created: item.created,
      }));
      return;
    case 'ticketById':
      ctx.response.body = tickets.find((item) => item.id === Number(ctx.request.query.id));
      return;
    case 'createTicket':
      inputData = JSON.parse(ctx.request.body);
      tickets.push({
        id: tickets[tickets.length - 1].id + 1,
        name: inputData.name,
        description: inputData.description,
        status: false,
        created: (new Date()).getTime(),
      });
      ctx.response.body = tickets;
      return;
    case 'deleteTicket':
      tickets = tickets.filter((item) => item.id !== Number(ctx.request.query.id));
      ctx.response.body = tickets;
      return;
    case 'editTicket':
      inputData = JSON.parse(ctx.request.body);
      ticket = tickets.find((item) => item.id === Number(ctx.request.query.id));
      ticket.name = inputData.name;
      ticket.description = inputData.description;
      ctx.response.body = tickets;
      return;
    case 'editStatus':
      inputData = JSON.parse(ctx.request.body);
      ticket = tickets.find((item) => item.id === Number(ctx.request.query.id));
      ticket.status = (inputData.status === 'true');
      ctx.response.body = tickets;
      return;
    default:
      ctx.response.status = 404;
  }
});

const port = process.env.PORT || 8120;
const server = http.createServer(app.callback());
server.listen(port, (err) => {
  if (err) {
    console.log('Error occured:', err);
    return;
  }
  console.log(`Server is listening on ${port} port`);
});
