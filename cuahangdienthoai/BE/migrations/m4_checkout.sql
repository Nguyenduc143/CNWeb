-- Thêm Address
CREATE OR ALTER PROCEDURE sp_AddUserAddress
    @UserId UNIQUEIDENTIFIER,
    @FullName NVARCHAR(255),
    @PhoneNumber NVARCHAR(20),
    @AddressLine NVARCHAR(500),
    @Ward NVARCHAR(120),
    @District NVARCHAR(120),
    @Province NVARCHAR(120),
    @Note NVARCHAR(300) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @AddressId UNIQUEIDENTIFIER = NEWID();
    
    INSERT INTO Addresses (AddressId, CustomerId, ReceiverName, ReceiverPhone, Line1, Ward, District, Province, Note, CreatedAt)
    VALUES (@AddressId, @UserId, @FullName, @PhoneNumber, @AddressLine, @Ward, @District, @Province, @Note, GETDATE());

    SELECT AddressId, ReceiverName as FullName, ReceiverPhone as PhoneNumber, Line1 as AddressLine, Ward, District, Province, Note FROM Addresses WHERE AddressId = @AddressId;
END
GO

-- Lấy ds địa chỉ
CREATE OR ALTER PROCEDURE sp_GetAddressesByUser
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT AddressId, ReceiverName as FullName, ReceiverPhone as PhoneNumber, Line1 as AddressLine, Ward, District, Province, Note
    FROM Addresses WHERE CustomerId = @UserId ORDER BY CreatedAt DESC;
END
GO

-- Xóa địa chỉ
CREATE OR ALTER PROCEDURE sp_DeleteAddress
    @AddressId UNIQUEIDENTIFIER,
    @UserId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM Addresses WHERE AddressId = @AddressId AND CustomerId = @UserId;
END
GO

-- Khởi tạo Hóa đơn
CREATE OR ALTER PROCEDURE sp_CreateOrder
    @CustomerId UNIQUEIDENTIFIER,
    @AddressId UNIQUEIDENTIFIER,
    @Subtotal DECIMAL(18,2),
    @DiscountAmount DECIMAL(18,2) = 0,
    @Total DECIMAL(18,2),
    @PaymentMethod NVARCHAR(50),
    @Note NVARCHAR(500) = NULL,
    @OrderItemsJson NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @OrderId UNIQUEIDENTIFIER = NEWID();
        
        INSERT INTO Orders (OrderId, CustomerId, AddressId, Status, Subtotal, DiscountAmount, Total, PaymentMethod, Note, CreatedAt, UpdatedAt)
        VALUES (@OrderId, @CustomerId, @AddressId, 0, @Subtotal, @DiscountAmount, @Total, @PaymentMethod, @Note, GETDATE(), GETDATE());

        INSERT INTO OrderDetails (OrderDetailId, OrderId, ProductId, Quantity, UnitPrice, TotalPrice)
        SELECT NEWID(), @OrderId, ProductId, Quantity, Price, Quantity * Price
        FROM OPENJSON(@OrderItemsJson)
        WITH (
            ProductId UNIQUEIDENTIFIER '$.ProductId',
            Quantity INT '$.Quantity',
            Price DECIMAL(18,2) '$.Price'
        );

        COMMIT TRANSACTION;
        SELECT @OrderId AS OrderId;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- Lịch sử hóa đơn
CREATE OR ALTER PROCEDURE sp_GetOrdersByUser
    @CustomerId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT OrderId, Status, Total, PaymentMethod, CreatedAt
    FROM Orders 
    WHERE CustomerId = @CustomerId
    ORDER BY CreatedAt DESC;
END
GO

-- Chi tiết đơn hàng
CREATE OR ALTER PROCEDURE sp_GetOrderDetails
    @OrderId UNIQUEIDENTIFIER,
    @CustomerId UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS(SELECT 1 FROM Orders WHERE OrderId = @OrderId AND CustomerId = @CustomerId)
    BEGIN
        SELECT O.OrderId, O.Status, O.Total, O.PaymentMethod, O.Note, O.CreatedAt,
               A.ReceiverName, A.ReceiverPhone, A.Line1, A.Ward, A.District, A.Province
        FROM Orders O
        JOIN Addresses A ON O.AddressId = A.AddressId
        WHERE O.OrderId = @OrderId;

        SELECT D.ProductId, D.Quantity, D.UnitPrice, D.TotalPrice, P.ProductName, P.Image1 AS ProductImage
        FROM OrderDetails D
        JOIN Products P ON D.ProductId = P.ProductId
        WHERE D.OrderId = @OrderId;
    END
END
GO
