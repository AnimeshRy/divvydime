import { NextRequest, NextResponse } from 'next/server'
import { getGroupExpenses, getGroup } from '@/lib/api'

export async function GET(
    request: NextRequest,
    {params}: {params: {groupId: string}}
) {
    try {
        const group = await getGroup(params.groupId)
        if (!group) {
            return NextResponse.json({
                error: 'Group not found',
            }, {status: 404})
        }

        const expenses = await getGroupExpenses(params.groupId, {
            offset: 0,
            length: 10000,
        })

        const exportData = {
            groupId: group.id,
            groupName: group.name,
            currency: group.currency,
            exportDate: new Date().toISOString(),
            expenses: expenses
        }

        const headers = new Headers()
        headers.set('Content-Type', 'application/json')
        headers.set('Content-Disposition', 'attachment; filename="expenses.json"')

        return new NextResponse(JSON.stringify(exportData, null, 2), {
            status: 200,
            headers: headers,
        })
    } catch (error) {
        console.error('Error exporting expenses:', error)
        return NextResponse.json({
            error: 'Internal server error',
        }, {status: 500})
    }
}
