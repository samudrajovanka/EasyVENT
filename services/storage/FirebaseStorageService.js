/* eslint-disable no-async-promise-executor */
import InvariantError from '@exceptions/InvariantError';
import { NO_FILE_ERR_MSG } from '@constants/errorMessage';
import { FILE_UPLOAD_ERR } from '@constants/errorType';
import { storage } from '@lib/firebase';
import fs from 'fs';

class FirebaseStorageService {
  _upload(file) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!file) {
          reject(new InvariantError(NO_FILE_ERR_MSG, FILE_UPLOAD_ERR));
        }

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  uploadImage(file, path) {
    return new Promise(async (resolve, reject) => {
      try {
        this._upload(file);

        const metadata = {
          contentType: file.type,
        };

        const storageRef = storage.ref();
        const pathName = `images/${path}/${+Date.now()}-${file.name}`;
        const imageRef = storageRef.child(pathName);
        const rawData = fs.readFileSync(file.path);
        const snapshot = await imageRef.put(rawData, metadata);
        const url = await snapshot.ref.getDownloadURL();

        resolve({
          url, pathName,
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteFile(path) {
    return new Promise(async (resolve, reject) => {
      try {
        const storageRef = storage.ref();
        const imageRef = storageRef.child(path);
        await imageRef.delete();

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default FirebaseStorageService;
