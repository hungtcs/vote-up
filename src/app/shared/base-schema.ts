import { ObjectID } from 'mongodb';
import { DateUtil } from './utils/index';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

export class BaseSchema<T> {

  @Expose()
  public get id() {
    return this._id?.toString();
  }
  public set id(id) {
    if(id) {
      this._id = new ObjectID(id);
    }
  }

  @Exclude({ toPlainOnly: true })
  _id?: ObjectID;

  @Exclude({ toPlainOnly: true })
  __v?: number;

  @Transform(params => DateUtil.parse(params.value), { toClassOnly: true })
  @Transform(params => DateUtil.format(params.value), { toPlainOnly: true })
  @ApiProperty({ description: '创建时间', type: () => Date })
  public createdAt?: Date;

  @Transform(params => DateUtil.parse(params.value), { toClassOnly: true })
  @Transform(params => DateUtil.format(params.value), { toPlainOnly: true })
  @ApiProperty({ description: '修改时间', type: () => Date })
  public updatedAt?: Date;

  constructor(partial: Partial<T>) {
    Object.assign(this, partial);
  }

}
