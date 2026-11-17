import { Application } from '../schemas/application.schema.js';
import mongoose from 'mongoose';

function clone(record) {
  if (!record) return null;
  return record.toObject ? record.toObject() : record;
}

export const applicationRepository = {
  async create(userId, data) {
    try {
      const application = await Application.create({
        userId: new mongoose.Types.ObjectId(userId),
        company: data.company,
        role: data.role,
        location: data.location,
        status: data.status || 'Applied',
        jobUrl: data.jobUrl || '',
        source: data.source || 'Other',
        appliedDate: data.appliedDate || new Date(),
        jobDescription: data.jobDescription || '',
        interviews: data.interviews || [],
        notes: data.notes || [],
        history: data.history || [
          {
            _id: new mongoose.Types.ObjectId(),
            status: data.status || 'Applied',
            at: new Date(),
          },
        ],
      });
      return clone(application);
    } catch (error) {
      throw error;
    }
  },

  async findById(userId, id) {
    try {
      const application = await Application.findOne({
        _id: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(userId),
      });
      return clone(application);
    } catch (error) {
      return null;
    }
  },

  async findMany(userId, filters = {}) {
    try {
      const query = { userId: new mongoose.Types.ObjectId(userId) };

      if (filters.status) {
        query.status = filters.status;
      }

      const applications = await Application.find(query)
        .sort({ appliedDate: -1 })
        .lean();

      return applications;
    } catch (error) {
      throw error;
    }
  },

  // async update(userId, id, changes) {
  //   try {
  //     // If status is being updated, add to history
  //     let updateData = { ...changes };
  //     if (changes.status) {
  //       delete updateData.statusNotes;
  //     }

  //     const application = await Application.findOneAndUpdate(
  //       {
  //         _id: new mongoose.Types.ObjectId(id),
  //         userId: new mongoose.Types.ObjectId(userId),
  //       },
  //       updateData,
  //       { new: true, runValidators: true },
  //       { returnDocument: 'after' }
  //     );

  //     return clone(application);
  //   } catch (error) {
  //     throw error;
  //   }
  // },


  async update(userId, id, changes) {
    const application = await Application.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!application) {
      return null;
    }

    // Copy editable fields, but don't let the form overwrite history.
    const {
      history,
      statusNotes,
      ...fieldsToUpdate
    } = changes;

    const previousStatus = application.status;
    const newStatus = fieldsToUpdate.status;

    // Update normal fields only.
    Object.assign(application, fieldsToUpdate);

    // Append history only when the status actually changes.
    if (newStatus && newStatus !== previousStatus) {
      application.history.push({
        status: newStatus,
        at: new Date(),
        notes: statusNotes || '',
      });
    }

    await application.save();

    return clone(application);
  },

  async remove(userId, id) {
    try {
      const result = await Application.deleteOne({
        _id: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(userId),
      });
      return result.deletedCount > 0;
    } catch (error) {
      return false;
    }
  },

  async seedDemoApplication(userId) {
    try {
      const existing = await this.findMany(userId);
      if (existing.length > 0) return;

      const today = new Date().toISOString().slice(0, 10);
      await this.create(userId, {
        company: 'Tech Corp',
        role: 'Senior Developer',
        location: 'Remote',
        status: 'Interview',
        jobUrl: 'https://example.com/job/1',
        source: 'LinkedIn',
        appliedDate: new Date(today),
        jobDescription: 'We are looking for a senior developer...',
        notes: [],
        interviews: [
          {
            _id: new mongoose.Types.ObjectId(),
            type: 'Technical Round',
            scheduledAt: new Date(today),
          },
        ]
      });
    } catch (error) {
      console.error('Error seeding demo application:', error);
    }
  },

  // Additional MongoDB-specific methods for stats and aggregations
  async getStatsByUser(userId) {
    try {
      const stats = await Application.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);
      return stats;
    } catch (error) {
      throw error;
    }
  },

  async addInterview(userId, applicationId, interview) {
    try {
      const application = await Application.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(applicationId),
          userId: new mongoose.Types.ObjectId(userId),
        },
        {
          $push: {
            interviews: {
              _id: new mongoose.Types.ObjectId(),
              ...interview,
            },
          },
        },
        { new: true },
        { returnDocument: 'after' }
      );
      return clone(application);
    } catch (error) {
      throw error;
    }
  },

  async addNote(userId, applicationId, content) {
    try {
      const application = await Application.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(applicationId),
          userId: new mongoose.Types.ObjectId(userId),
        },
        {
          $push: {
            notes: {
              _id: new mongoose.Types.ObjectId(),
              content,
            },
          },
        },
        { new: true },
        { returnDocument: 'after' }
      );
      return clone(application);
    } catch (error) {
      throw error;
    }
  },
};
