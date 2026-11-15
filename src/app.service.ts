import { Injectable } from '@nestjs/common';
import mysql from 'mysql2/promise'
import { Parkolas } from './parkolas.js';
import { ParkolasDTO } from './parkolas.dto.js';


const mysqlConnections = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'parkolo'
})

@Injectable()
export class AppService {
    async getParkolasok(): Promise<Parkolas[]>{
      const[results] = await mysqlConnections.execute(
        'select * from parkolas Order by idotartam desc'
      );
      return(results as any[]).map((item)=>({
        id: item.id,
        rendszam:item.rendszam,
        tulajdonos: item.tulajdonos,
        idotartam: item.idotartam,
        fizetve: Boolean(item.fizetve),
      }));
    }

    async addParkolas(body: ParkolasDTO){
      const[results] = await mysqlConnections.execute(
        'insert into parkolas (rendszam, tulajdonos, idotartam, fizetve) VALUES (?, ?, ?, ?)',
        [body.rendszam, body.tulajdonos, body.idotartam, body.fizetve],
      );
      return results;
    }

  }

