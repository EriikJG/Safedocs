BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[users] (
    [id] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [username] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000),
    [avatar] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [users_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [users_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [users_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [dbo].[documents] (
    [id] NVARCHAR(1000) NOT NULL,
    [filename] NVARCHAR(1000) NOT NULL,
    [originalName] NVARCHAR(1000) NOT NULL,
    [mimeType] NVARCHAR(1000) NOT NULL,
    [size] INT NOT NULL,
    [encryptedPath] NVARCHAR(1000) NOT NULL,
    [encryptionKey] NVARCHAR(1000) NOT NULL,
    [checksum] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [isPublic] BIT NOT NULL CONSTRAINT [documents_isPublic_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [documents_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [documents_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[document_tags] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [documentId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [document_tags_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[shared_links] (
    [id] NVARCHAR(1000) NOT NULL,
    [token] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000),
    [expiresAt] DATETIME2,
    [maxViews] INT,
    [currentViews] INT NOT NULL CONSTRAINT [shared_links_currentViews_df] DEFAULT 0,
    [isActive] BIT NOT NULL CONSTRAINT [shared_links_isActive_df] DEFAULT 1,
    [allowDownload] BIT NOT NULL CONSTRAINT [shared_links_allowDownload_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [shared_links_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [documentId] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [shared_links_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [shared_links_token_key] UNIQUE NONCLUSTERED ([token])
);

-- CreateTable
CREATE TABLE [dbo].[chat_messages] (
    [id] NVARCHAR(1000) NOT NULL,
    [content] NVARCHAR(1000) NOT NULL,
    [isSystem] BIT NOT NULL CONSTRAINT [chat_messages_isSystem_df] DEFAULT 0,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [chat_messages_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [userId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [chat_messages_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[documents] ADD CONSTRAINT [documents_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[document_tags] ADD CONSTRAINT [document_tags_documentId_fkey] FOREIGN KEY ([documentId]) REFERENCES [dbo].[documents]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[shared_links] ADD CONSTRAINT [shared_links_documentId_fkey] FOREIGN KEY ([documentId]) REFERENCES [dbo].[documents]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[shared_links] ADD CONSTRAINT [shared_links_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[chat_messages] ADD CONSTRAINT [chat_messages_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[users]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
