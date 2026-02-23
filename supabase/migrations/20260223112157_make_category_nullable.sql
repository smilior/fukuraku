-- Make category nullable on expenses and incomes
ALTER TABLE expenses ALTER COLUMN category DROP NOT NULL;
ALTER TABLE incomes ALTER COLUMN category DROP NOT NULL;
