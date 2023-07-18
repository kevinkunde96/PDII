const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const saltRounds = 10;
const bcrypt = require("bcrypt");
const nomes = [
  "Kevin",
  "Miguel",
  "Arthur",
  "Gael",
  "Helena",
  "Alice",
  "Theo",
  "Laura"
];

async function main() {
  const salt = bcrypt.genSaltSync(saltRounds);
  const roles = await prisma.role.createMany({
    data: [
      {
        id: 1,
        description: "MANAGER"
      },
      {
        id: 2,
        description: "USER"
      }
    ]
  });
  const users = await prisma.user.createMany({
    data: nomes.map((nome, i) => {
      return {
        name: nome,
        email: `${nome}@gmail.com`,
        password: bcrypt.hashSync(`123456`, salt),
        roleId: i === 0 ? 1 : Math.random() <= 0.5 ? 1 : 2
      };
    })
  });

  const findUsers = await prisma.user.findMany();

  const tasks = await prisma.task.createMany({
    data: findUsers.map((user, index) => {
      return {
        userId: user.id,
        description: "Tarefa",
        expected_date: new Date(),
        title: "Tarefa Titulo"
      };
    })
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
