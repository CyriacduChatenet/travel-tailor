import { Activity } from '../../../activity/entities/activity.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Timestamp } from '../../../config/utils/timestamp.util';
import { ActivitySchedule } from '../activity-schedule/entities/activity-schedule.entity';
import { ActivityClosingDay } from '../activity-closing-day/entities/activity-closing-day.entity';

@Entity()
export class ActivityDetail extends Timestamp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false})
  duration: number;

  @Column({ nullable: false})
  location: string;

  @OneToOne(() => Activity, (activity) => activity.detail)
  activity: Activity;

  @OneToMany(() => ActivitySchedule, schedule => schedule.activityDetail, { cascade: true })
  schedules: ActivitySchedule[];

  @OneToMany(() => ActivityClosingDay, closingDays => closingDays.activityDetail, { cascade: true })
  closingDays: ActivityClosingDay[];

}
