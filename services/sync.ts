import { db } from "~/db/drizzle";
import { tests } from "~/db/schema";
import { eq, or } from "drizzle-orm";
import { checkConnectivity } from "~/utils/network";
import axios from "axios";

// Replace with your actual API endpoint
const API_ENDPOINT = "http://192.168.24.153:3000/flask-api/python";

type TestData = typeof tests.$inferInsert;
interface UploadFile {
  name: string;
  type: string;
  uri: string;
}

// Function to convert base64/dataURL to Blob
function dataURLtoBlob(dataurl: string) {
  try {
    // Check if it's a data URL (starts with data:)
    if (dataurl.startsWith('data:')) {
      const arr = dataurl.split(',');
      const match = arr[0].match(/:(.*?);/);
      if (!match) throw new Error('Invalid data URL format');
      const mime = match[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while(n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {type: mime});
    } else {
      // Handle plain base64 string
      const byteString = atob(dataurl);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: 'image/jpeg' }); // Default to JPEG if no mime type
    }
  } catch (error) {
    console.error('Error converting image:', error);
    throw new Error('Invalid image data');
  }
}

export const uploadTest = async (testData: TestData) => {
  const isConnected = await checkConnectivity();

  if (!isConnected) {
    // Save locally with pending status
    await db.insert(tests).values({
      ...testData,
      syncStatus: "pending",
    });
    return { success: true, offline: true };
  }
 
  try {
    // Create FormData object
    const formData = new FormData();
    
    // Add all test data fields to FormData
    formData.append('participantId', testData.participantId);
    formData.append('name', testData.name);
    formData.append('age', testData.age.toString());
    formData.append('gender', testData.gender);
    formData.append('location', testData.location);
    formData.append('createdAt', testData.createdAt);
    formData.append('createdBy', testData.createdBy);
    
    if (testData.onchoImage) {
      formData.append("onchoImage", {
        uri: testData.onchoImage,
        name: "oncho.jpg",
        type: "image/jpeg",
      } as any);
    }
    if (testData.schistoImage) {
      formData.append("schistoImage", {
        uri: testData.schistoImage,
        name: "schisto.jpg",
        type: "image/jpeg",
      } as any);
    }
      if (testData.lfImage) {
      formData.append("lfImage", {
        uri: testData.lfImage,
        name: "lf.jpg",
        type: "image/jpeg",
      } as any);
    }
    if (testData.helminthImage) {
      formData.append("helminthImage", {
        uri: testData.helminthImage,
        name: "helminth.jpg",
        type: "image/jpeg",
      } as any);
    }
    
    
    console.log("Sending request to:", API_ENDPOINT);
    console.log("FormData contents:", Object.fromEntries(formData.entries()));
    
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      // No need to set Content-Type header - browser sets it automatically with boundary
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    }).catch(error => {
      console.error("Network error:", error);
      throw new Error("Network request failed. Please check your connection and try again.");
    });

    
    const responseText = await response.text();
    console.log("Raw response:", responseText);
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      throw new Error("Invalid response from server. Please try again.");
    }
    
    console.log("Upload response:", responseData);

    if (response.ok) {
      // Save locally with synced status
      await db.insert(tests).values({
        ...testData,
        syncStatus: "synced",
      });
      return { success: true, offline: false };
    } else {
      // Save locally with failed status
      await db.insert(tests).values({
        ...testData,
        syncStatus: "failed",
      });
      return { success: false, offline: false };
    }
  } catch (error) {
    console.log("Upload error:", error);
    // Save locally with failed status
    await db.insert(tests).values({
      ...testData,
      syncStatus: "failed",
    });
    return { success: false, offline: false };
  }
};

export const syncPendingTests = async () => {
  try {
    const pendingTests = await db
      .select()
      .from(tests)
      .where(or(eq(tests.syncStatus, "pending"), eq(tests.syncStatus, "failed")));

    for (const test of pendingTests) {
      try {
        // Create FormData object
        const formData = new FormData();
        
        // Add all test data fields to FormData
        formData.append('participantId', test.participantId);
        formData.append('name', test.name);
        formData.append('age', test.age.toString());
        formData.append('gender', test.gender);
        formData.append('location', test.location);
        formData.append('createdAt', test.createdAt);
        formData.append('createdBy', test.createdBy);
        
        // Add image data if present
        if (test.onchoImage) {
          const blob = dataURLtoBlob(test.onchoImage);
          formData.append('onchoImage', blob, 'onchoImage.jpg');
        }
        if (test.schistoImage) {
          const blob = dataURLtoBlob(test.schistoImage);
          formData.append('schistoImage', blob, 'schistoImage.jpg');
        }
        if (test.lfImage) {
          const blob = dataURLtoBlob(test.lfImage);
          formData.append('lfImage', blob, 'lfImage.jpg');
        }
        if (test.helminthImage) {
          const blob = dataURLtoBlob(test.helminthImage);
          formData.append('helminthImage', blob, 'helminthImage.jpg');
        }

        // Replace with your actual API endpoint
        const response = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });

        const responseData = await response.json();
        console.log("Sync response for test", test.id, ":", responseData);

        if (response.ok) {
          await db
            .update(tests)
            .set({ syncStatus: "synced" })
            .where(eq(tests.id, test.id));
        } else {
          await db
            .update(tests)
            .set({ syncStatus: "failed" })
            .where(eq(tests.id, test.id));
        }
      } catch (error) {
        console.log("Sync error for test", test.id, ":", error);
        await db
          .update(tests)
          .set({ syncStatus: "failed" })
          .where(eq(tests.id, test.id));
      }
    }
  } catch (error) {
    console.error("Sync error:", error);
  }
};
