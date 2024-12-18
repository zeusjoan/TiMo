import { Model, DataTypes } from 'sequelize';
import sequelize from '../lib/database';

interface TimeEntryAttributes {
  id?: number;
  userId: string;
  month: string;
  capexHours: number;
  opexHours: number;
  supportHours: number;
  overtimeHours: number; // Suma zatwierdzonych nadgodzin
  description: string;
  isApproved: boolean; // Czy miesiąc został zatwierdzony
}

class TimeEntry extends Model<TimeEntryAttributes> implements TimeEntryAttributes {
  public id!: number;
  public userId!: string;
  public month!: string;
  public capexHours!: number;
  public opexHours!: number;
  public supportHours!: number;
  public overtimeHours!: number;
  public description!: string;
  public isApproved!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TimeEntry.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    month: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capexHours: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    opexHours: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    supportHours: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    overtimeHours: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'TimeEntry',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'month']
      }
    ]
  }
);

export { TimeEntry, type TimeEntryAttributes };
