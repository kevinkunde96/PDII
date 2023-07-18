const prisma = require('../prisma/prisma')
const { startOfYear, endOfYear } = require('date-fns')


const dateToTimestamp = (date) => {
  newDate = new Date(date).toISOString();
  return newDate
}

module.exports = {
  async index(req, res) {

    const userId = req.user.user_id
 
    const tasks = await prisma.$queryRaw`
    SELECT "Task".*, to_char("Task".expected_date, 'DD-MM-YYYY') as "expected_date_format", uu.name
    FROM "Task"
    INNER JOIN "User" ON "User".id = "Task"."userId"
    INNER JOIN "User" uu ON uu.id = "User"."managerId"
    WHERE "Task"."userId" = ${userId} OR "User"."managerId" = ${userId}
    ORDER BY "Task"."id";
  `;

    res.status(200).json(tasks);

  },
  async getUsers(req, res) {
    const users = await prisma.user.findMany({
      orderBy: {
        id: 'asc',
      },
      include: {
        role: true,
        manager: true
      }
    });

    res.status(200).json(users);
  },


  async update(req, res) {
    const { id, title, description, userId, createdAt, solved, expected_date } = req.body;

    const task = await prisma.task.update({
      where: { id: +id },
      data: {
        title: title,
        description: description,
        userId: userId ? Number(userId) : undefined,
        createdAt: createdAt,
        solved: solved,
        expected_date: dateToTimestamp(expected_date)
      }
    })

    res.status(200).json(task);
  },

  async add(req, res) {
    const { userId, title, description, expected_date } = req.body;

    const task = await prisma.task.create({
      data: {
        userId: Number(userId),
        title: title,
        description: description,
        expected_date: new Date(expected_date),
      }
    });

    res.status(200).json(task);
  },

  async deleteTask(req, res) {
    const taskId = req.params.id;

    const task = await prisma.task.delete({
      where: {
        id: Number(taskId),
      },
    });

    res.status(200).json(task);
  },

  async completeTask(req, res) {
    const taskId = req.params.id;

    const task = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        solved: true,
      },
    });

    res.status(200).json(task);
  },

  async getTaskByUser(req, res) {

    const userId = req.user.user_id

    const tasks = await prisma.$queryRaw`
    SELECT "Task".*, to_char("Task".expected_date, 'DD-MM-YYYY') as "expected_date_format", uu.name
    FROM "Task"
    INNER JOIN "User" ON "User".id = "Task"."userId"
    INNER JOIN "User" uu ON uu.id = "User"."managerId"
    WHERE "Task"."solved" = 'false' AND "Task"."userId" = ${userId}
    ORDER BY "Task"."id";
  `;

    res.status(200).json(tasks);

  },

  async getDashboardAllTasks(req, res) {

    const userId = req.user.user_id
    const startDate = new Date(req.query.startDate)
    const endDate = new Date(req.query.endDate)

    let data = await prisma.$queryRaw`
      SELECT "User".name, COUNT("Task".id) AS task_count
      FROM "User"
      LEFT JOIN "Task" ON "User".id = "Task"."userId" 
        AND "Task"."createdAt" BETWEEN ${startDate} AND ${endDate}
      WHERE "User"."managerId" = ${userId}
      GROUP BY "User".id
      ORDER BY "User".id ASC;
    `;

    return res.status(200).json(data.map(values => ({
      name: values.name,
      "Quantidade de tarefas": Number(values.task_count)
    })));

  },

  async getDashboardCountTasks(req, res) {

    const userId = req.user.user_id
    const startDate = new Date(req.query.startDate)
    const endDate = new Date(req.query.endDate)

    let data = await prisma.$queryRaw`
      SELECT "Task".solved, COUNT("Task".id) AS task_count
      FROM "Task"
      INNER JOIN "User" ON "Task"."userId" = "User"."id"
      WHERE "Task"."createdAt" BETWEEN ${startDate} AND ${endDate}
      AND  "User"."managerId" = ${userId}
      GROUP BY "Task".solved
      ORDER BY "Task".solved ASC;
    `;

    return res.status(200).json(data.map(values => ({
      name: values.solved ? "Resolvidas" : "Não resolvidas",
      "Quantidade de tarefas": Number(values.task_count)
    })));

  },

  async getDashboardCountGlobalByMonth(req, res) {

    const userId = req.user.user_id
    const startDate = new Date(req.query.startDate)
    const endDate = new Date(req.query.endDate)

    const startYear = startOfYear(startDate)
    const endYear = endOfYear(endDate)

    let dataTeam = await prisma.$queryRaw`
      SELECT DATE_TRUNC('month', "Task"."createdAt") AS month, COUNT("Task".id) AS task_count
      FROM "Task"
      INNER JOIN "User" ON "Task"."userId" = "User"."id"
      WHERE "Task"."createdAt" BETWEEN ${startYear} AND ${endYear}
      AND  "User"."managerId" = ${userId}
      GROUP BY month;
    `;

    let dataGlobal = await prisma.$queryRaw`
      SELECT DATE_TRUNC('month', "Task"."createdAt") AS month, COUNT("Task".id) AS task_count
      FROM "Task"
      INNER JOIN "User" ON "Task"."userId" = "User"."id"
      WHERE "Task"."createdAt" BETWEEN ${startYear} AND ${endYear}
      GROUP BY month;
    `;

    const mergedData = dataTeam.map((value, i) => ({
      "Meu time": Number(value.task_count),
      "Empresa": Number(dataGlobal[i].task_count),
      "date": value.month.toLocaleDateString('pt-BR', {
        month: 'short',
      })
    }))
    return res.status(200).json(mergedData);

  },


  async getTaskByMonth(req, res) {

    const userId = req.user.user_id
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;

    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          {
            userId: Number(userId),
            createdAt: {
              month: currentMonth
            }
          },
          {
            user: { managerId: Number(userId) },
            createdAt: {
              month: currentMonth
            }
          }
        ]
      },
      include: { period: true, user: true }
    });

    res.status(200).json(tasks);

  },

  async getTaskByWeek(req, res) {

    const userId = req.user.user_id
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // Obtém o dia da semana atual (0 a 6, onde 0 é Domingo)
    const diff = currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // Obtém o primeiro dia da semana atual
    const firstDayOfWeek = new Date(currentDate.setDate(diff));
    const lastDayOfWeek = new Date(currentDate.setDate(diff + 6));

    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          {
            userId: Number(userId),
            createdAt: {
              gte: firstDayOfWeek,
              lte: lastDayOfWeek
            }
          },
          {
            user: { managerId: Number(userId) },
            createdAt: {
              gte: firstDayOfWeek,
              lte: lastDayOfWeek
            }
          }
        ]
      },
      include: { period: true, user: true }
    });

    res.status(200).json(tasks);

  }
}  