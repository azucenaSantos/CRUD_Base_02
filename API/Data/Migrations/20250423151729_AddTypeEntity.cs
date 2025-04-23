using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTypeEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TypeEntityId",
                table: "Foods",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "TypeEntity",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nombre = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TypeEntity", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Foods_TypeEntityId",
                table: "Foods",
                column: "TypeEntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Foods_TypeEntity_TypeEntityId",
                table: "Foods",
                column: "TypeEntityId",
                principalTable: "TypeEntity",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Foods_TypeEntity_TypeEntityId",
                table: "Foods");

            migrationBuilder.DropTable(
                name: "TypeEntity");

            migrationBuilder.DropIndex(
                name: "IX_Foods_TypeEntityId",
                table: "Foods");

            migrationBuilder.DropColumn(
                name: "TypeEntityId",
                table: "Foods");
        }
    }
}
