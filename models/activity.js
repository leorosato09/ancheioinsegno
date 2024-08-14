import mongoose from 'mongoose';

const SectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true, // Durata in minuti
  },
});

const ActivitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  orderGrade: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  keyCompetencies: {
    type: [String],
    required: true,
  },
  manifestoPrinciples: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sections: {
    type: [SectionSchema],
    required: true,
  },
  totalDuration: {
    type: Number,
    required: true, // Durata totale inserita manualmente
  },
  tags: {
    type: [String],  // Array di stringhe per i tag
    default: [],     // Imposta un array vuoto come valore predefinito
  },
});

export default mongoose.models.Activity || mongoose.model('Activity', ActivitySchema);