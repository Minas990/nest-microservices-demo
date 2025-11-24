import { PrimaryGeneratedColumn } from "typeorm";

export  class AbstractEntity<T>
{
    @PrimaryGeneratedColumn()
    id:number;
    
    constructor()
    {
        // Intentionally empty: subclasses should hydrate their own fields
        // after `super()` returns to avoid being overwritten by
        // TypeScript's emitted property initializers and decorators.
    }
}