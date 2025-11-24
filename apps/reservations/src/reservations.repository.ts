import { AbstractRepository } from "@app/common";
import { Logger } from "@nestjs/common";
import { Reservation } from "./models/reservations.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";

export class ReservationRepository extends AbstractRepository<Reservation>
{
    protected readonly logger = new Logger(ReservationRepository.name);
    constructor(
        @InjectRepository(Reservation) reservationRepository:Repository<Reservation>,
        entityManager: EntityManager
    )
    {
        super(reservationRepository,entityManager);
    }
}