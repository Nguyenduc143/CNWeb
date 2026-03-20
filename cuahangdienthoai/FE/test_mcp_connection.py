import asyncio
import os
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def test_mcp():
    env = os.environ.copy()
    env["MSSQL_HOST"] = "localhost"
    env["MSSQL_DATABASE"] = "CHDT"
    env["MSSQL_USER"] = "dummy"
    env["MSSQL_PASSWORD"] = "dummy"
    env["MSSQL_DRIVER"] = "ODBC Driver 17 for SQL Server"
    env["TrustServerCertificate"] = "yes"
    env["Trusted_Connection"] = "yes"

    server_params = StdioServerParameters(
        command="uvx",
        args=["--from", "mssql-mcp-server", "mssql_mcp_server.exe"],
        env=env
    )

    print("Connecting to MCP server...")
    try:
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                print("Successfully initialized session!")
                
                print("Listing available tools...")
                tools = await session.list_tools()
                for tool in tools.tools:
                    print(f"- {tool.name}: {tool.description}")

                print("Testing connection by reading database schema...")
                result = await asyncio.wait_for(
                    session.call_tool("execute_sql", arguments={
                        "query": "SELECT @@VERSION as version"
                    }),
                    timeout=5.0
                )
                print(f"Result: {result.content[0].text}")

    except Exception as e:
        print(f"Error testing connection: {e}")

if __name__ == "__main__":
    asyncio.run(test_mcp())
