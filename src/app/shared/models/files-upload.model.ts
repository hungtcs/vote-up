import { ApiProperty } from "@nestjs/swagger";

export class FilesUploadModel {

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  public files: any[] = [];

}
