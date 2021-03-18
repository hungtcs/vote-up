import { Body, ClassSerializerInterceptor, Controller, Get, Param, Put, Redirect, Render, UseInterceptors } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { MongoDocumentInterceptor, UsernameInterceptor } from '../shared';
import { Vote, VoteDocument } from './vote.schema';
import { ObjectID } from 'mongodb';
import { Cookies } from '../shared/decorators';
import { classToPlain, plainToClass } from 'class-transformer';

@Controller()
@UseInterceptors(UsernameInterceptor)
@UseInterceptors(ClassSerializerInterceptor)
export class VoteUpController {

  constructor(
      @InjectModel(Vote.name) private readonly VoteModel: Model<VoteDocument>) {

  }

  @Put('vote')
  @ApiBody({ type: Vote, required: true })
  @ApiResponse({ type: Vote })
  @UseInterceptors(MongoDocumentInterceptor({ type: Vote }))
  public async createVote(
      @Body() vote: Vote) {
    return await new this.VoteModel(vote).save();
  }

  @Get()
  @Render('index.njk')
  public async voteList() {
    const votes = await this.VoteModel.find({}).exec();
    console.log(votes);

    return { votes };
  }

  @Get('vote/:id')
  @Render('vote.njk')
  public async voteDetail(
      @Param('id') id: string) {
    const vote = await this.VoteModel.findById(new ObjectID(id));
    return {
      vote: classToPlain(plainToClass(Vote, vote?.toObject())),
    };
  }

  @Put('vote/:id/option/:option')
  public async vote(
      @Param('id') id: string,
      @Param('option') option: string,
      @Cookies('username') username: string) {
    await this.VoteModel.updateOne(
      {
        _id: new ObjectID(id),
        'options.title': option,
      },
      {
        $addToSet: {
          'options.$.voters': username,
        }
      }
    ).exec();
    const vote = await this.VoteModel.findById(new ObjectID(id)).exec();
    return { vote };
  }



}
