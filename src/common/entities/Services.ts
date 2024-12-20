import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Clients } from "./Clients";

@Entity("services", { schema: "bd_agricole" })
export class Services {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "libelle", nullable: true, length: 50 })
  libelle: string | null;

  @Column("varchar", { name: "description", nullable: true, length: 50 })
  description: string | null;

  @Column("timestamp", { name: "createdAt", nullable: true })
  createdAt: Date | null;

  @Column("timestamp", { name: "updatedAt", nullable: true })
  updatedAt: Date | null;

  @Column("timestamp", { name: "deletedAt", nullable: true })
  deletedAt: Date | null;

  @Column("varchar", { name: "createdBy", nullable: true, length: 50 })
  createdBy: string | null;

  @Column("varchar", { name: "updatedBy", nullable: true, length: 50 })
  updatedBy: string | null;

  @Column("varchar", { name: "deletedBy", nullable: true, length: 50 })
  deletedBy: string | null;

  @Column("bit", { name: "isDeleted", nullable: true })
  isDeleted: boolean | null;

  @OneToMany(() => Clients, (clients) => clients.services)
  clients: Clients[];
}
