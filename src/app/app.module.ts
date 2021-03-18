import { Module } from '@nestjs/common';
import { VoteUpModule } from './vote-up/vote-up.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    VoteUpModule,
    MongooseModule.forRoot(
      'mongodb://vote-up:vote-up@localhost/vote-up',
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    ),
  ],
})
export class AppModule {

}
