import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("__template__", { schema: "users" })
export class __Template__ {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "code", nullable: true, length: 50 })
  code: string | null;

  @Column("varchar", { name: "libelle", nullable: true, length: 50 })
  libelle: string | null;

  @Column("date", { name: "updatedAt", nullable: true })
  updatedAt: string | null;

  @Column("date", { name: "createdAt", nullable: true })
  createdAt: string | null;

  @Column("date", { name: "deletedAt", nullable: true })
  deletedAt: string | null;

  @Column({ default: false })
  isDeleted: boolean;
}
