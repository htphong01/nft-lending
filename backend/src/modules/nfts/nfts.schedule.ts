import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { NftsService } from "./nfts.service";
@Injectable()
export class TransactionSchedule {

  constructor(
    private nftsService: NftsService,
  ) { }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleEvents() {
    await this.nftsService.handleNftEvent()
  }
}
