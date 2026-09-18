import asyncpg
import asyncio


async def main():
    conn = await asyncpg.connect(
        'postgresql://postgres.iblipcxirftrnkrcxylh:InternSync2026@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres'
    )

    # ---- 1. Dump all 3 trigger functions ----
    rows = await conn.fetch("""
        SELECT p.proname, pg_get_functiondef(p.oid) AS def
        FROM pg_proc p
        WHERE p.proname IN (
            'handle_new_auth_user',
            'handle_new_student_profile',
            'handle_new_company'
        )
    """)
    for r in rows:
        print('=' * 60)
        print('FUNCTION:', r['proname'])
        print('=' * 60)
        print(r['def'])
        print()

    # ---- 2. Real insert test ----
    print('=' * 60)
    print('MANUAL INSERT TEST')
    print('=' * 60)
    try:
        test_id = await conn.fetchval('SELECT gen_random_uuid()')
        role_id = await conn.fetchval("SELECT id FROM public.roles WHERE code='student'")
        inst_id = await conn.fetchval('SELECT id FROM public.institutes LIMIT 1')

        print('test_id =', test_id)
        print('role_id =', role_id)
        print('inst_id =', inst_id)
        print()

        await conn.execute("""
            INSERT INTO public.users (id, email, name, role_id, institute_id, status)
            VALUES ($1, $2, $3, $4, $5, $6)
        """, test_id, 'pytest-direct@test.com', 'Pytest User', role_id, inst_id, 'active')
        print('users INSERT: OK')

        await conn.execute("""
            INSERT INTO public.student_profiles (user_id, roll_no, branch, semester, cgpa, institute_id)
            VALUES ($1, $2, $3, $4, $5, $6)
        """, test_id, 'PYTEST-001', 'CSE', 3, 8.0, inst_id)
        print('student_profiles INSERT: OK')

        await conn.execute('DELETE FROM public.student_profiles WHERE user_id = $1', test_id)
        await conn.execute('DELETE FROM public.users WHERE id = $1', test_id)
        print('CLEANUP: OK')

    except Exception as e:
        print('FAILED:', type(e).__name__, '-', e)

    await conn.close()


asyncio.run(main())