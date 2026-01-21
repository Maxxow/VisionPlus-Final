import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ListsModule } from './lists/lists.module';
import { VideosModule } from './videos/videos.module';
import { HistoryModule } from './history/history.module';

import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { CommentsModule } from './comments/comments.module';


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        // MongooseModule.forRootAsync({
        //     imports: [ConfigModule],
        //     useFactory: async (configService: ConfigService) => ({
        //         uri: configService.get<string>('MONGO_URI'),
        //     }),
        //     inject: [ConfigService],
        // }),
        ThrottlerModule.forRoot([{
            ttl: 60000,
            limit: 150,
        }]),
        AuthModule,
        // MoviesModule, // modulo de peliculas con TMDB (costó configurarlo cawn)
        // ProfilesModule, // modulo de perfiles
        // ListsModule, // modulo de listas personalizadas
        // VideosModule, // modulo de videos
        // HistoryModule, // modulo de historial
        // SubscriptionsModule, // modulo de suscripciones y pagos
        // CommentsModule, // modulo de comentarios y reacciones
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'uploads'),
            serveRoot: '/uploads',
        }),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule { }
