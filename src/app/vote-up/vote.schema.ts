import { Type } from "class-transformer";
import { Document } from "mongoose";
import { BaseSchema } from "../shared";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  _id: false,
})
export class VoteOption {

  @Prop()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '选项名称' })
  public title!: string;

  @Prop({ type: [String], default: [] })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ApiProperty({ description: '投票人', type: 'string', isArray: true })
  public voters: Array<string> = [];

}

export const VoteOptionSchema = SchemaFactory.createForClass(VoteOption);

@Schema(
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
)
export class Vote extends BaseSchema<Vote> {

  @Prop({ unique: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '投票名称' })
  public title!: string;

  @Prop({ type: [VoteOptionSchema], default: [] })
  @Type(() => VoteOption)
  @ApiProperty({ description: '投票选项', type: VoteOption, isArray: true })
  @ValidateNested({ each: true })
  public options: Array<VoteOption> = [];

}


export type VoteDocument = Vote & Document;

export const VoteSchema = SchemaFactory.createForClass(Vote);
