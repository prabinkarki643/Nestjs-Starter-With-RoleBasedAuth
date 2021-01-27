import { registerAs } from "@nestjs/config";

export default registerAs('database', () => ({
    defaultConnection: 'mongodb',
    connections: {
      inmemory: {
        settings: {
          type: 'inmemory',
          useNewUrlParser: true,
          synchronize: true,
          logging: true,
          useUnifiedTopology: true,
        }
      },
      mongodb:{
        settings: {
          type: 'mongodb',
          useNewUrlParser: true,
          synchronize: true,
          logging: true,
          useUnifiedTopology: true,
          ssl: true,
          url:process.env.MONGO_URI,
        }
      }
    }
  }));