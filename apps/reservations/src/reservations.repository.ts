import { AbstractRepository } from "@app/common";
import { Logger } from "@nestjs/common";
import { ReservationDocument } from "./models/reservations.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

export class ReservationRepository extends AbstractRepository<ReservationDocument>
{
    protected readonly logger = new Logger(ReservationDocument.name);
    constructor(
        @InjectModel(ReservationDocument.name) reservationModel : Model<ReservationDocument>
    )
    {
        super(reservationModel);
    }
}