import { Module } from '@nestjs/common';
import { VoteUpService } from './vote-up.service';
import { VoteUpController } from './vote-up.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vote, VoteSchema } from './vote.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Vote.name, schema: VoteSchema },
      ],
    ),
  ],
  providers: [
    VoteUpService,
  ],
  controllers: [
    VoteUpController,
  ],
})
export class VoteUpModule {

}
