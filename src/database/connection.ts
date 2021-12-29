import { Sequelize } from "sequelize/dist";
import dotenv from "dotenv";

dotenv.config()
const sequelize = new Sequelize(
  process.env.DB_CONNECTION_STRING, 
  {
    dialect: 'postgres', 
    define: {
      createdAt: 'createdat',
      updatedAt: 'updatedat'
    },
    logging: false,
    pool: {
      max:5,
      min:0,
      idle:10000
  }
  }
) 

 async function connectdb() {
    try {
        await sequelize.authenticate();
        console.log('DB connected!');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
    
    return sequelize;
}

export { connectdb, sequelize }