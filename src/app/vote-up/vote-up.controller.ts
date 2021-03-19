import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, HttpStatus, Param, Put, Redirect, Render, UseInterceptors } from '@nestjs/common';
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

  @Get()
  @Render('index.njk')
  public async voteList() {
    const votes = await this.VoteModel.find({}).exec();

    return {
      votes: votes.map(vote => classToPlain(plainToClass(Vote, vote.toObject()))),
    };
  }

  @Get('create')
  @Render('create.njk')
  public async renderCreateVote() {}

  @Put('create')
  @ApiBody({ type: Vote })
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(MongoDocumentInterceptor({ type: Vote }))
  public async createVote(
      @Body() vote: Vote) {
    return await new this.VoteModel(vote).save();
  }

  @Get('vote/:id')
  @Render('vote.njk')
  public async voteDetail(
      @Param('id') id: string,
      @Cookies('username') username: string) {
    const vote = plainToClass(Vote, (await this.VoteModel.findById(new ObjectID(id)))!.toObject());

    const disabled = vote.options.reduce((count, option) => option.voters.includes(username) ? count + 1 : count, 0) > 1;

    const votersCount = vote.options.reduce((count, option) => option.voters.length + count, 0);

    return {
      vote: { ...classToPlain(vote) },
      disabled,
      votersCount,
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
