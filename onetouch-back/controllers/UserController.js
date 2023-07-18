const prisma = require('../prisma/prisma')
const saltRounds = 10;
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports = {
  async index(req, res) {
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
    const { id, name, email, password, roleId, managerId } = req.body;

    const user = await prisma.user.update({
      where: { id: +id },
      data: {
        name: name,
        email: email,
        roleId: roleId ? Number(roleId) : undefined,
        managerId: managerId ? Number(managerId) : undefined
      }
    })

    res.status(200).json(user);
  },
  async roles(req, res) {
    const roles = await prisma.role.findMany();

    res.status(200).json(roles);
  },

  async add(req, res) {
    const { name, email, password, roleId, managerId } = req.body;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hash,
        roleId: Number(roleId),
        managerId: Number(managerId)
      }
    })

    res.status(200).json(user);
  },

  async deleteUser(req, res) {
    const userId = req.params.id;

    const user = await prisma.user.delete({
      where: {
        id: Number(userId),
      },
    });

    res.status(200).json(user);
  },

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ msg: "Login/Senha Incorretos" });
      return;
    }

    try {
      const dados = await prisma.user.findFirst({
        where: { email: email },
        include: { role: true }
      });

      if (dados?.length == 0) {

        res.status(400).json({ msg: "Login/Senha incorretos..." });
        return;
      }

      if (bcrypt.compareSync(password, dados.password)) {

        const token = jwt.sign({
          user_id: dados.id,
          user_name: dados.name,
          role_id: dados.role.id
        },
          process.env.JWT_KEY,
          { expiresIn: "365d" }
        );
        res.status(200).json({ token, user_id: dados.id, user_name: dados.name, roleId: dados.roleId });

      } else {

        res.status(400).json({ msg: "Login/Senha Incorretos..." });
      }
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },
};