import { FILE_TYPE_ERR_MSG } from '@constants/errorMessage';
import { FILE_UPLOAD_ERR } from '@constants/errorType';
import InvariantError from '@exceptions/InvariantError';
import formidable from 'formidable';

const uploadFormData = (
  req,
  { typeFile, maxFileSize, multiples } = { maxFIleSize: 1 * 1024 * 1024, multiples: false },
) => new Promise((resolve, reject) => {
  const form = formidable.IncomingForm();
  form.keepExtensions = true;
  form.keepFileName = true;
  form.multiples = multiples;
  form.maxFileSize = maxFileSize;

  if (typeFile) {
    form.on('file', (filename, file) => {
      if (typeFile.indexOf(file.type) === -1) {
        reject(new InvariantError(FILE_TYPE_ERR_MSG, FILE_UPLOAD_ERR));
      }
    });
  }

  form.parse(req, (err, fields, files) => {
    if (err) {
      reject(err);
    }

    resolve({ fields, files });
  });
});

export default uploadFormData;
