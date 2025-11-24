import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservations.repository';
import { PAYMENTS_SERVICE, User } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';
import { Reservation } from './models/reservations.entity';

@Injectable()
export class ReservationsService {

    constructor(
        private readonly reservationsRepository:ReservationRepository,
        @Inject(PAYMENTS_SERVICE) private paymentsService:ClientProxy
    )
    {

    }
    async create(
        createReservationDto: CreateReservationDto,
        { email, id: userId }: User,
    ) {

        
        return this.paymentsService
        .send('create_charge', {
            ...createReservationDto.charge,
            email,
        })
        .pipe(
            map((res) => {
                const reservation = new Reservation({
                    ...createReservationDto,
                    invoiceId: res.id,
                    timestamp: new Date(),
                    userId,
                });

                return this.reservationsRepository.create(reservation);
            }),
        );
    }

    async findAll() {
        return this.reservationsRepository.find({});
    }

    async findOne(id: number) {
        return this.reservationsRepository.findOne({id});
    }

    async update(id: number, updateReservationDto: UpdateReservationDto) {
        return this.reservationsRepository.findOneAndUpdate(
            {id},
            updateReservationDto
        )
    }

    async remove(id: number) {
        return this.reservationsRepository.findOneAndDelete({id});
    }
}
