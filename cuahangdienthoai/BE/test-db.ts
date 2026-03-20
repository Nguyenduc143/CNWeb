import sql from 'mssql/msnodesqlv8';

const run = async () => {
    try {
        await sql.connect('Server=localhost\\SQLEXPRESS;Database=CHDT;Trusted_Connection=Yes;Driver={SQL Server}');
        console.log("✅ Success with SQL Server");
    } catch (e: any) {
        console.log("❌ Fail SQL Server:", e.message);
        try {
            await sql.connect('Server=localhost\\SQLEXPRESS;Database=CHDT;Trusted_Connection=Yes;Driver={ODBC Driver 17 for SQL Server}');
            console.log("✅ Success with ODBC 17");
        } catch(e2: any) {
             console.log("❌ Fail ODBC 17:", e2.message);
             try {
                 await sql.connect('Server=localhost\\SQLEXPRESS;Database=CHDT;Trusted_Connection=Yes;Driver={ODBC Driver 16 for SQL Server}');
                 console.log("✅ Success with ODBC 16");
             } catch(e3: any) {
                 console.log("❌ Fail ODBC 16:", e3.message);
                 try {
                     await sql.connect({
                         server: 'localhost\\SQLEXPRESS',
                         database: 'CHDT',
                         driver: 'msnodesqlv8',
                         options: { trustedConnection: true }
                     });
                     console.log("✅ Success with Object Config");
                 } catch (e4: any) {
                     console.log("❌ Fail Object Config:", e4.message);
                 }
             }
        }
    }
    process.exit();
}
run();
