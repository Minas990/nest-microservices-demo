import { AbstractEntity } from "@app/common";
import { Column, Entity } from "typeorm";

@Entity({})

export class Reservation extends AbstractEntity<Reservation>
{
    @Column()
    timestamp: Date;
    @Column()
    startDate: Date;
    @Column()
    endDate: Date;
    @Column()
    userId: number; 
    @Column()
    invoiceId: string;
    
    constructor(entity?: Partial<Reservation>) {
        super();
        if (entity) Object.assign(this, entity);
    }
}
