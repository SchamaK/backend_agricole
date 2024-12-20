import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Services } from "./Services";

@Index("FK_clients_services", ["servicesId"], {})
@Entity("clients", { schema: "bd_agricole" })
export class Clients {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "services_Id", nullable: true })
  servicesId: number | null;

  @Column("varchar", { name: "nom", nullable: true, length: 100 })
  nom: string | null;

  @Column("varchar", { name: "prenom", nullable: true, length: 100 })
  prenom: string | null;

  @Column("varchar", { name: "email", nullable: true, length: 250 })
  email: string | null;

  @Column("varchar", { name: "telephone", nullable: true, length: 50 })
  telephone: string | null;

  @Column("varchar", { name: "commentaire", nullable: true, length: 500 })
  commentaire: string | null;

  @Column("varchar", { name: "deletedBy", nullable: true, length: 50 })
  deletedBy: string | null;

  @Column("varchar", { name: " updatedBy", nullable: true, length: 50 })
  updatedBy: string | null;

  @Column("varchar", { name: "createdBy", nullable: true, length: 50 })
  createdBy: string | null;

  @Column("timestamp", { name: "createdAt", nullable: true })
  createdAt: Date | null;

  @Column("timestamp", { name: "updatedAt", nullable: true })
  updatedAt: Date | null;

  @Column("timestamp", { name: "deletedAt", nullable: true })
  deletedAt: Date | null;

  @Column("bit", { name: "isDeleted", nullable: true })
  isDeleted: boolean | null;

  @ManyToOne(() => Services, (services) => services.clients, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "services_Id", referencedColumnName: "id" }])
  services: Services;
}
