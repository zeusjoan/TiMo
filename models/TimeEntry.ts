import { Model, DataTypes } from 'sequelize';
import sequelize from '../lib/database';

// Interfejs dla nadgodzin
interface OvertimeAttributes {
  id?: number;
  date: string;
  startTime: string;
  endTime: string;
  incidentNumber: string;
  description: string;
  duration: number;
  timeEntryId?: number;
}

// Interfejs dla wpisu czasowego
interface TimeEntryAttributes {
  id?: number;
  userId: string;
  month: string;
  capexHours: number;
  opexHours: number;
  supportHours: number;
  description: string;
  overtimeHours: number;
}

// Model dla nadgodzin
class Overtime extends Model<OvertimeAttributes> implements OvertimeAttributes {
  public id!: number;
  public date!: string;
  public startTime!: string;
  public endTime!: string;
  public incidentNumber!: string;
  public description!: string;
  public duration!: number;
  public timeEntryId!: number;
}

Overtime.init(
  {
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    incidentNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Overtime',
  }
);

// Model dla wpisu czasowego
class TimeEntry extends Model<TimeEntryAttributes> implements TimeEntryAttributes {
  public id!: number;
  public userId!: string;
  public month!: string;
  public capexHours!: number;
  public opexHours!: number;
  public supportHours!: number;
  public description!: string;
  public overtimeHours!: number;

  // Asocjacje
  public readonly overtimes?: Overtime[];
}

TimeEntry.init(
  {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    overtimeHours: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'TimeEntry',
  }
);

// Definiujemy relacje
TimeEntry.hasMany(Overtime, {
  foreignKey: 'timeEntryId',
  as: 'overtimes',
});
Overtime.belongsTo(TimeEntry, {
  foreignKey: 'timeEntryId',
});

export { TimeEntry, Overtime };
