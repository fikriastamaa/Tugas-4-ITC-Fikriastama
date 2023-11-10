const Division = require('../model/Division');
const User = require('../model/User');

const getAllUser = async (req, res, next)=>{
  try {
    //TUGAS NOMOR 1
    const users = await User.findAll({
      attributes: ["id", "fullName", "angkatan", "divisionId"], include: {
        model: Division,
        attributes: ["name"]
      }
    });
    res.status(200).json({
      status: "Success",
      message: "Succesfully fetch all user data",
      users: users,
    });
  } catch (error) {
    console.log(error.message);
  }
}

const getUserById = async (req,res,next)=>{
  try {
    //TUGAS NOMOR 2 cari user berdasarkan userId
    const {userId} = req.params
    const users = await User.findOne({
      where: { Id: userId },
      attributes: ["id", "fullName", "angkatan", "divisionId"], include: {
        model: Division,
        attributes: ["name"]
      }
    });
    //jika id tidak ditemukan dalam tabel users
    if (users == null) {
      res.status(404).json({
        status: "Not Found",
        message: `User with id ${userId} is not existed`,
      });
    } else {
      //jika id ada di tabel users
      res.status(200).json({
        status: "Success",
        message: "Succesfully fetch user data",
        user: users,
      });
    }
  } catch (error) {
    console.log(error.message);
  };
}

const postUser = async(req,res,next)=>{
  try {
    const {
      fullName, nim, angkatan, email, password, division
    } = req.body
    

    //cari divisi id
    //pakai await untuk menghindari penulisan then
    const user_division = await Division.findOne({
      where:{
        name: division
      }
    });

    //SELECT * FROM DIVISION WHERE name = division
    if(user_division == undefined){
      res.status(400).json({
        status: "Error",
        message: `${division} is not existed`
      })
    }

    //insert data ke tabel User
    const currentUser = await User.create({
      //nama field: data
      fullName: fullName,
      //jika nama field == data maka bisa diringkas
      email,
      password,
      angkatan,
      nim,
      divisionId: user_division.id
    })

    //send response
    res.status(201).json({
      status: "success",
      message: "Successfuly create User",
      user: {
        fullName: currentUser.fullName,
        division: currentUser.division
      }
    })

  } catch (error) {
    console.log(error);
  }
}

const deleteUser = (req,res,next)=>{
  try {
    const {userId} = req.params;

    //mencari index user dari array model user
    const targetedIndex = User.findIndex((element)=>{
      return element.id == userId
    })

    //user tidak ketemu
    if(targetedIndex === -1){
      res.status(400).json({
        status: "Error",
        message: `User with id ${userId} is not existed`
      })
    }

    //hapus array pada [targetedIndex] sebanyak 1 buah element
    User.splice(targetedIndex, 1);

    res.status(200).json({
      status: "Success",
      message: "Successfully delete user"
    })
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  getAllUser, getUserById, postUser, deleteUser
}