const { uploadDocument, fetchDocumentById, fetchDocumentsByTask } = require('../models/documentModel.js');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const path = require('path');

/*
// Configure multer to specify where and how to store files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../uploads/');  // File will be saved in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file to avoid conflicts
  }
});
*/

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // limit: 50MB
});

// Azure Blob Storage client setup
const connectionString = 'DefaultEndpointsProtocol=https;AccountName=samzsdk93b3;AccountKey=BCD+OtSdMfTpj3AXY1P5xSUZRvA71vqgH3QGoOeUH45xaJkQ7/exMBNI3UKhaCw/yOLvztx61gIu+ASt6Oufyw==;EndpointSuffix=core.windows.net';
const containerName = 'kanbandocs';

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

/**
 * Middleware for handling single file upload with field name 'file'.
 * Uses in-memory storage to hold uploaded file in `req.file.buffer`.
 */
exports.uploadMiddleware = upload.single('file');

/**
 * Uploads a document to Azure Blob Storage and stores its metadata in the database.
 * 
 * @param {import('express').Request} req - Express request object containing `taskId` and file.
 * @param {import('express').Response} res - Express response object.
 */
exports.uploadDocument = async (req, res) => {
  try {
    // get fields from req
    const taskId = req.body.taskId;
    const originalFilename = req.file.originalname;
    const userId = req.user.id; 

    // generate a unique filename
    const ext = path.extname(originalFilename);
    const filename = `${Date.now()}${ext}`;

    // Upload buffer to Azure Blob Storage
    const blockBlobClient = containerClient.getBlockBlobClient(filename);
    await blockBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: { blobContentType: req.file.mimetype }
    });

    // Call the model function to store document metadata (versioning, etc.)
    const documentId = await uploadDocument(taskId, userId, filename, originalFilename);
    
    res.status(201).json({ message: 'Document uploaded successfully', documentId });
  } catch (err) {
    console.error("Upload Document error:", err);
    res.status(500).json({ message: 'Error uploading document' });
  }
};

/**
 * Downloads a document from Azure Blob Storage based on the document ID.
 * 
 * @param {import('express').Request} req - Express request object with `documentId` in body.
 * @param {import('express').Response} res - Express response object used to stream the file.
 */
exports.downloadDocument = async (req, res) => {
  try {
    const documentId = req.query.documentId;
    const doc = await fetchDocumentById(documentId);

    const blobClient = containerClient.getBlockBlobClient(doc.filename);
    const downloadResponse = await blobClient.download();

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${doc.original_filename}"`
    );
    res.setHeader(
      'Content-Type',
      downloadResponse.contentType || 'application/octet-stream'
    );

    downloadResponse.readableStreamBody.pipe(res);
  } catch (err) {
    console.error('Error downloading document:', err);
    res.status(500).json({ message: 'Error downloading document' });
  }
};

/**
 * Fetches the most recent document ID associated with a given task.
 * 
 * @param {import('express').Request} req - Express request object with `taskId` in body.
 * @param {import('express').Response} res - Express response object.
 */
exports.getDocumentIdForTask = async (req, res) => {
  try {
    const taskId = req.query.taskId;
    const docs = await fetchDocumentsByTask(taskId);
    const newestDoc = docs[0];

    res.status(200).json({ message: 'Newest document fetched', documentId: newestDoc.document_id });
  } catch (err) {
    console.error('Error getting document id:', err);
    res.status(500).json({ message: 'Error getting document id' });
  }
};
