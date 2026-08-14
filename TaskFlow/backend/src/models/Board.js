import { getDatabase } from '../db/database.js';
import { v4 as uuidv4 } from 'uuid';

class Board {
    static async getAll() {
        const db = await getDatabase();
        return db.all('SELECT * FROM boards ORDER BY created_at DESC');
    }

    static async getById(id) {
        const db = await getDatabase();
        return db.get('SELECT * FROM boards WHERE id = ?', [id]);
    }

    static async getWithColumnsAndTasks(id) {
        const db = await getDatabase();
        
        // Get board
        const board = await this.getById(id);
        if (!board) return null;

        // Get columns with tasks
        const columns = await db.all(
            `SELECT * FROM columns WHERE board_id = ? ORDER BY position ASC`,
            [id]
        );

        // Get all tasks for this board
        const tasks = await db.all(
            `SELECT t.*, c.name as column_name, c.position as column_position 
             FROM tasks t 
             JOIN columns c ON t.column_id = c.id 
             WHERE c.board_id = ? 
             ORDER BY c.position ASC, t.position ASC`,
            [id]
        );

        // Group tasks by column
        const columnsWithTasks = columns.map(column => ({
            ...column,
            tasks: tasks.filter(task => task.column_id === column.id)
        }));

        return {
            ...board,
            columns: columnsWithTasks
        };
    }

    static async create(name) {
        const db = await getDatabase();
        const id = uuidv4();
        
        await db.run(
            'INSERT INTO boards (id, name) VALUES (?, ?)',
            [id, name]
        );

        // Create default columns
        const defaultColumns = ['To Do', 'In Progress', 'Done'];
        for (let i = 0; i < defaultColumns.length; i++) {
            await db.run(
                'INSERT INTO columns (id, board_id, name, position) VALUES (?, ?, ?, ?)',
                [uuidv4(), id, defaultColumns[i], i]
            );
        }

        return this.getById(id);
    }
}

export default Board;