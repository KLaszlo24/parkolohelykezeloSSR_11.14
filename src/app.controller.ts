import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import { ParkolasDTO } from './parkolas.dto.js';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @Render('index')
    async getParkolasok() {
        return {
            parkolasok: await this.appService.getParkolasok(),
        };
    }

    @Post()
    @Render('index')
    async addParkolas(@Body() body: ParkolasDTO) {
        const rendszam = String(body.rendszam ?? '').trim().toUpperCase();
        const tulajdonos = String(body.tulajdonos ?? '').trim();
        const idotartamSzoveg = String(body.idotartam ?? '').trim();
        const idotartam = Number(idotartamSzoveg);
        const fizetveSzoveg = String(body.fizetve ?? '');

        // Az új magyar rendszámformátum: AA BB-123
        const rendszamRegex = /^[A-Z]{2} [A-Z]{2}-\d{3}$/;

        if (!rendszamRegex.test(rendszam)) {
            return {
                parkolasok: await this.appService.getParkolasok(),
                error: 'Hibás rendszám! A megfelelő formátum például: AA BB-123.',
            };
        }

        if (tulajdonos.length < 6) {
            return {
                parkolasok: await this.appService.getParkolasok(),
                error: 'A tulajdonos neve legalább 6 karakter hosszú legyen.',
            };
        }

        if (
            idotartamSzoveg === '' ||
            !Number.isInteger(idotartam) ||
            idotartam < 1 ||
            idotartam > 24
        ) {
            return {
                parkolasok: await this.appService.getParkolasok(),
                error: 'Az időtartam 1 és 24 közötti pozitív egész szám legyen.',
            };
        }

        if (fizetveSzoveg !== 'true' && fizetveSzoveg !== 'false') {
            return {
                parkolasok: await this.appService.getParkolasok(),
                error: 'A fizetve mező értéke csak logikai érték lehet.',
            };
        }

        await this.appService.addParkolas({
            rendszam,
            tulajdonos,
            idotartam,
            fizetve: fizetveSzoveg === 'true',
        });

        return {
            parkolasok: await this.appService.getParkolasok(),
            success: 'A parkolás sikeresen rögzítve lett.',
        };
    }
}
