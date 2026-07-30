USE [EmployeeManagementDB]
GO
/****** Object:  Table [dbo].[Employees]    Script Date: 30-07-2026 14:56:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Employees](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Email] [nvarchar](150) NOT NULL,
	[Department] [nvarchar](100) NOT NULL,
	[Salary] [decimal](18, 2) NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[UpdatedDate] [datetime] NULL,
	[CreatedBy] [int] NULL,
	[UpdatedBy] [int] NULL,
	[IsDeleted] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 30-07-2026 14:56:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [nvarchar](100) NOT NULL,
	[Password] [nvarchar](200) NOT NULL,
	[FullName] [nvarchar](150) NOT NULL,
	[Role] [nvarchar](50) NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[UpdatedDate] [datetime] NULL,
	[RefreshToken] [nvarchar](500) NULL,
	[RefreshTokenExpiryTime] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Employees] ADD  DEFAULT (getdate()) FOR [CreatedDate]
GO
ALTER TABLE [dbo].[Employees] ADD  CONSTRAINT [DF_Employees_IsDeleted]  DEFAULT ((0)) FOR [IsDeleted]
GO
ALTER TABLE [dbo].[Users] ADD  CONSTRAINT [DF_Users_CreatedDate]  DEFAULT (getdate()) FOR [CreatedDate]
GO
/****** Object:  StoredProcedure [dbo].[sp_AddEmployee]    Script Date: 30-07-2026 14:56:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[sp_AddEmployee]
    @Name NVARCHAR(100),
    @Email NVARCHAR(100),
    @Department NVARCHAR(100),
    @Salary DECIMAL(18,2),
    @CreatedBy INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Employees
    (
        Name,
        Email,
        Department,
        Salary,
        CreatedDate,
        CreatedBy,
        IsDeleted
    )
    VALUES
    (
        @Name,
        @Email,
        @Department,
        @Salary,
        GETDATE(),
        @CreatedBy,
        0
    );

    SELECT SCOPE_IDENTITY() AS NewEmployeeId;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_DeleteEmployee]    Script Date: 30-07-2026 14:56:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[sp_DeleteEmployee]
    @Id INT,
    @UpdatedBy INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Employees
    SET
        IsDeleted = 1,
        UpdatedDate = GETDATE(),
        UpdatedBy = @UpdatedBy
    WHERE Id = @Id
      AND IsDeleted = 0;

    SELECT @@ROWCOUNT AS AffectedRows;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEmployeeByEmail]    Script Date: 30-07-2026 14:56:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[sp_GetEmployeeByEmail]
    @Email NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        Id,
        Name,
        Email,
        Department,
        Salary,
		CreatedDate,
		UpdatedDate
    FROM Employees
    WHERE LTRIM(RTRIM(LOWER(Email))) = LTRIM(RTRIM(LOWER(@Email)));
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEmployeeById]    Script Date: 30-07-2026 14:56:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[sp_GetEmployeeById]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        Name,
        Email,
        Department,
        Salary,
        CreatedDate,
        UpdatedDate
    FROM Employees
    WHERE Id = @Id
      AND IsDeleted = 0;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEmployeeDashboardSummary]    Script Date: 30-07-2026 14:56:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[sp_GetEmployeeDashboardSummary]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        COUNT(*) AS TotalEmployees,
        COUNT(DISTINCT Department) AS TotalDepartments,
        ISNULL(AVG(Salary), 0) AS AverageSalary
    FROM Employees
    WHERE IsDeleted = 0;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEmployeeDepartmentSummary]    Script Date: 30-07-2026 14:56:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[sp_GetEmployeeDepartmentSummary]
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Department,
        COUNT(*) AS EmployeeCount,
        ISNULL(SUM(Salary), 0) AS TotalSalary,
        ISNULL(AVG(Salary), 0) AS AverageSalary
    FROM Employees
    WHERE IsDeleted = 0
    GROUP BY Department
    ORDER BY Department;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetEmployees]    Script Date: 30-07-2026 14:56:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[sp_GetEmployees]
    @SearchTerm NVARCHAR(100) = '',
    @PageNumber INT = 1,
    @PageSize INT = 5
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        Name,
        Email,
        Department,
        Salary,
        CreatedDate,
        UpdatedDate
    FROM Employees
    WHERE IsDeleted = 0
      AND (
            @SearchTerm = ''
            OR Name LIKE '%' + @SearchTerm + '%'
            OR Department LIKE '%' + @SearchTerm + '%'
          )
    ORDER BY Id DESC
    OFFSET (@PageNumber - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;

    SELECT COUNT(*)
    FROM Employees
    WHERE IsDeleted = 0
      AND (
            @SearchTerm = ''
            OR Name LIKE '%' + @SearchTerm + '%'
            OR Department LIKE '%' + @SearchTerm + '%'
          );
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetUserById]    Script Date: 30-07-2026 14:56:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[sp_GetUserById]
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        Username,
        Password,
        FullName,
        Role,
        RefreshToken,
        RefreshTokenExpiryTime
    FROM Users
    WHERE Id = @UserId;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetUserByRefreshToken]    Script Date: 30-07-2026 14:56:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[sp_GetUserByRefreshToken]
    @RefreshToken NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        Username,
        Password,
        FullName,
        Role,
        RefreshToken,
        RefreshTokenExpiryTime
    FROM Users
    WHERE RefreshToken = @RefreshToken;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_GetUserByUsername]    Script Date: 30-07-2026 14:56:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[sp_GetUserByUsername]
    @Username NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        Username,
        Password,
        FullName,
        Role,
        RefreshToken,
        RefreshTokenExpiryTime
    FROM Users
    WHERE Username = @Username;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_LoginUser]    Script Date: 30-07-2026 14:56:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[sp_LoginUser]
    @Username NVARCHAR(100),
    @Password NVARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id,
        Username,
        FullName,
        Role
    FROM Users
    WHERE Username = @Username
      AND Password = @Password;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_RegisterUser]    Script Date: 30-07-2026 14:56:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[sp_RegisterUser]
    @Username NVARCHAR(100),
    @Password NVARCHAR(200),
    @FullName NVARCHAR(150),
    @Role NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM Users WHERE Username = @Username)
    BEGIN
        RAISERROR('Username already exists.', 16, 1);
        RETURN;
    END

    INSERT INTO Users (Username, Password, FullName, Role, CreatedDate)
    VALUES (@Username, @Password, @FullName, @Role, GETDATE());

    SELECT SCOPE_IDENTITY() AS NewUserId;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_UpdateEmployee]    Script Date: 30-07-2026 14:56:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[sp_UpdateEmployee]
    @Id INT,
    @Name NVARCHAR(100),
    @Email NVARCHAR(100),
    @Department NVARCHAR(100),
    @Salary DECIMAL(18,2),
    @UpdatedBy INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Employees
    SET
        Name = @Name,
        Email = @Email,
        Department = @Department,
        Salary = @Salary,
        UpdatedDate = GETDATE(),
        UpdatedBy = @UpdatedBy
    WHERE Id = @Id
      AND IsDeleted = 0;

    SELECT @@ROWCOUNT AS AffectedRows;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_UpdateRefreshToken]    Script Date: 30-07-2026 14:56:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[sp_UpdateRefreshToken]
    @UserId INT,
    @RefreshToken NVARCHAR(500),
    @RefreshTokenExpiryTime DATETIME
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Users
    SET
        RefreshToken = @RefreshToken,
        RefreshTokenExpiryTime = @RefreshTokenExpiryTime,
        UpdatedDate = GETDATE()
    WHERE Id = @UserId;
END
GO
/****** Object:  StoredProcedure [dbo].[sp_UpdateUserPassword]    Script Date: 30-07-2026 14:56:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE   PROCEDURE [dbo].[sp_UpdateUserPassword]
    @UserId INT,
    @Password NVARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Users
    SET
        Password = @Password,
        UpdatedDate = GETDATE()
    WHERE Id = @UserId;
END
GO
