const { execSync } = require('child_process');
const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient();

// Receive path from command line arguments when invoked from API route
const mdbFile = process.argv[2] || path.resolve(__dirname, '../../FODE_SMS/studentsBE.mdb');
const tempDir = path.resolve(__dirname, '../temp');

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

function extractTableToCsv(tableName) {
    const csvPath = path.join(tempDir, `${tableName}.csv`);
    console.log(`Extracting ${tableName}...`);
    execSync(`mdb-export "${mdbFile}" "${tableName}" > "${csvPath}"`);
    return csvPath;
}

function parseDate(dateStr) {
    if (!dateStr) return null;
    const parsed = new Date(dateStr);
    return isNaN(parsed) ? null : parsed;
}

function parseBool(val) {
    return val === '1' || val === 'true' || val === 'True';
}

function parseIntSafe(val) {
    if (!val) return null;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? null : parsed;
}

function parseFloatSafe(val) {
    if (!val) return null;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? null : parsed;
}

async function migrateTable(tableName, processRow, createManyArgs) {
    const csvFile = extractTableToCsv(tableName);
    const results = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(csvFile)
            .pipe(csv())
            .on('data', (data) => {
                const processed = processRow(data);
                if (processed) results.push(processed);
            })
            .on('end', async () => {
                console.log(`Importing ${results.length} rows for ${tableName}...`);
                try {
                    for (let i = 0; i < results.length; i += 500) {
                        const chunk = results.slice(i, i + 500);
                        await createManyArgs(chunk);
                    }
                    console.log(`Finished ${tableName}`);
                    resolve();
                } catch (e) {
                    console.error(`Error importing ${tableName}:`, e);
                    reject(e);
                }
            });
    });
}

async function main() {
    console.log('Starting migration...');

    // In a full sync, we may want to clear old data first
    // await prisma.student.deleteMany({});
    // await prisma.mark.deleteMany({});
    // ...

    await migrateTable('tblDISTRICTS', row => ({
        DistrictID: parseIntSafe(row.DistrictID),
        DistrictNo: parseIntSafe(row.DistrictNo),
        ProvinceCode: row.ProvinceCode || null,
        DistrictName: row.DistrictName || null
    }), chunk => prisma.district.createMany({ data: chunk }));

    await migrateTable('tblPROVINCES', row => ({
        ProvinceCode: row.ProvinceCode,
        ProvinceNo: parseIntSafe(row.ProvinceNo),
        ProvinceName: row.ProvinceName || null
    }), chunk => prisma.province.createMany({ data: chunk }));

    await migrateTable('tblDENOMINATIONS', row => ({
        DenominationID: parseIntSafe(row.DenominationID),
        DenominationDesc: row.DenominationDesc || null
    }), chunk => prisma.denomination.createMany({ data: chunk }));

    await migrateTable('tblGRADE', row => ({
        GradeID: parseIntSafe(row.GradeID),
        gradeNAME: row.gradeNAME || null
    }), chunk => prisma.grade.createMany({ data: chunk }));

    await migrateTable('tblSUBJGRADECOSTmast', row => ({
        SubjID: row.SubjID,
        SubjName: row.SubjName || null,
        GradeID: parseIntSafe(row.GradeID),
        SubGrCODE: row.SubGrCODE || null,
        Cost: parseFloatSafe(row.Cost)
    }), chunk => prisma.subjectCost.createMany({ data: chunk }));

    await migrateTable('InstitutionInfo', row => ({
        InstitutionName: row.InstitutionName || null,
        InstitutionNumber: parseIntSafe(row.InstitutionNumber),
        InstitutionAddress1: row.InstitutionAddress1 || null,
        InstitutionAddress2: row.InstitutionAddress2 || null,
        InstitutionAddress3: row.InstitutionAddress3 || null,
        InstitutionAddress4: row.InstitutionAddress4 || null,
        InstitutionPhone: parseIntSafe(row.InstitutionPhone),
        InstitutionFax: parseIntSafe(row.InstitutionFax),
        ProvincialCode: parseIntSafe(row.ProvincialCode)
    }), chunk => prisma.institution.createMany({ data: chunk }));

    await migrateTable('tblSTUDENT', row => {
        if (!row.stdID) return null;
        return {
            stdID: parseIntSafe(row.stdID),
            Fname: row.Fname || null,
            Lname: row.Lname || null,
            MaritalStatus: row.MaritalStatus || null,
            Occupation: row.Occupation || null,
            CODE: parseBool(row.CODE),
            Gender: row.Gender || null,
            DOB: parseDate(row.DOB),
            DateEnrolled: parseDate(row['Date Enrolled']),
            ProvinceCODE: row.ProvinceCODE || null,
            DistrictID: parseIntSafe(row.DistrictID),
            DenominationID: parseIntSafe(row.DenominationID),
            hAddress1: row.hAddress1 || null,
            hAddress2: row.hAddress2 || null,
            hAddress3: row.hAddress3 || null,
            hAddress4: row.hAddress4 || null,
            hPhoneNo: row.hPhoneNo || null,
            hFaxNo: row.hFaxNo || null,
            Comments: row.Comments || null,
            certRCVD: parseBool(row.certRCVD),
            StudentNo: parseIntSafe(row.StudentNo),
            LastSchoolAttended: row.LastSchoolAttended || null,
            LastSchoolYear: row.LastSchoolYear || null,
            LastSchoolGrade: row.LastSchoolGrade || null,
            LastSchoolCertNo: row.LastSchoolCertNo || null
        };
    }, chunk => prisma.student.createMany({ data: chunk }));

    await migrateTable('tblMARKS', row => {
        if (!row.stdID) return null;
        return {
            stdID: parseIntSafe(row.stdID),
            DateRegistered: parseDate(row.DateRegistered),
            subjID: row.subjID || null,
            AS1: parseIntSafe(row.AS1),
            as1dateRetn: parseDate(row.as1dateRetn),
            AS2: parseIntSafe(row.AS2),
            as2dateRetn: parseDate(row.as2dateRetn),
            AS3: parseIntSafe(row.AS3),
            as3dateRetn: parseDate(row.as3dateRetn),
            AS4: parseIntSafe(row.AS4),
            as4dateRetn: parseDate(row.as4dateRetn),
            AS5: parseIntSafe(row.AS5),
            as5dateRetn: parseDate(row.as5dateRetn),
            AS6: parseIntSafe(row.AS6),
            as6dateRetn: parseDate(row.as6dateRetn),
            ApplyExam: parseBool(row.ApplyExam),
            DateApplyExam: parseDate(row.DateApplyExam),
            ExamRecvd: parseBool(row["ExamRec'vd"]),
            DateExamRecvd: parseDate(row["DateExamRec'vd"]),
            Sat4Exam: parseBool(row.Sat4Exam),
            DateSat4Exam: parseDate(row.DateSat4Exam),
            ExamRating: row.ExamRating || null,
            subjComplete: parseBool(row.subjComplete),
            subjFEE: parseIntSafe(row.subjFEE),
            MockExamResult: parseIntSafe(row.MockExamResult),
            DateSatMockExam: parseDate(row.DateSatMockExam),
        };
    }, chunk => prisma.mark.createMany({ data: chunk }));

    await migrateTable('tblFEES', row => {
        if (!row.stdID) return null;
        return {
            stdID: parseIntSafe(row.stdID),
            subjID: row.subjID || null,
            AmtPaid: parseIntSafe(row.AmtPaid),
            ReceiptNo: row.ReceiptNo || null,
            Date_Paid: parseDate(row.Date_Paid),
            AmtDUE: parseIntSafe(row.AmtDUE),
            Comments: row.Comments || null,
        };
    }, chunk => prisma.fee.createMany({ data: chunk }));

    console.log('Migration completed successfully!');
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })