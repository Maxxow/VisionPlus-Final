import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../users/schemas/user.schema';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        // MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'mi_super_secreto_123_cambiar_en_produccion',
            signOptions: { expiresIn: '24h' }, // el token dura 24 horas
            // signOptions: { expiresIn: '7d' }, // otra opcion
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService], // por si lo necesitamos en otros modulos
})
export class AuthModule { }
