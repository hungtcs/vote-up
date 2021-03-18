import { ApiProperty } from "@nestjs/swagger";

export class FileUploadModel {

  @ApiProperty({ type: 'string', format: 'binary' })
  public file: any;

}
