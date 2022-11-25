import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: true,
  })
  name: string;
}
