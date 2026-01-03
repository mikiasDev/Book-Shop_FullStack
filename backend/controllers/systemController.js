import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import multer from 'multer';
import mongoose from 'mongoose';

// BACKUP: Create a zip of database dump and uploads folder
export const backupSystem = async (req, res) => {
  try {
    // 1. Dump MongoDB database to a file
    const dumpPath = path.join(__dirname, '../../_backup/db_dump.json');
    const collections = await mongoose.connection.db.listCollections().toArray();
    const dbData = {};
    for (const col of collections) {
      dbData[col.name] = await mongoose.connection.db.collection(col.name).find({}).toArray();
    }
    fs.mkdirSync(path.dirname(dumpPath), { recursive: true });
    fs.writeFileSync(dumpPath, JSON.stringify(dbData, null, 2));

    // 2. Create zip archive of db_dump.json and uploads folder
    const zipPath = path.join(__dirname, '../../_backup/backup.zip');
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(output);
    archive.file(dumpPath, { name: 'db_dump.json' });
    archive.directory(path.join(__dirname, '../../uploads'), 'uploads');
    await archive.finalize();

    output.on('close', () => {
      res.download(zipPath, 'backup.zip');
    });
  } catch (err) {
    res.status(500).json({ message: 'Backup failed', error: err.message });
  }
};

// RESTORE: Accept a zip file, extract db_dump.json and uploads
const upload = multer({ dest: path.join(__dirname, '../../_backup/tmp') });
export const restoreSystem = [
  upload.single('backup'),
  async (req, res) => {
    try {
      const zipFile = req.file.path;
      const extractPath = path.join(__dirname, '../../_backup/restore');
      fs.mkdirSync(extractPath, { recursive: true });
      // Unzip
      const unzip = require('unzipper');
      await fs.createReadStream(zipFile).pipe(unzip.Extract({ path: extractPath })).promise();
      // Restore uploads
      fs.rmSync(path.join(__dirname, '../../uploads'), { recursive: true, force: true });
      fs.cpSync(path.join(extractPath, 'uploads'), path.join(__dirname, '../../uploads'), { recursive: true });
      // Restore database
      const dbDump = JSON.parse(fs.readFileSync(path.join(extractPath, 'db_dump.json')));
      for (const [col, docs] of Object.entries(dbDump)) {
        const collection = mongoose.connection.db.collection(col);
        await collection.deleteMany({});
        if (docs.length > 0) await collection.insertMany(docs);
      }
      res.json({ message: 'Restore completed successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Restore failed', error: err.message });
    }
  }
];
