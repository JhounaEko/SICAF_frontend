<?php

return [
    // Mapeo de nombres de ruta a arrays de columnas ordenables permitidas
    'sortable_columns' => [
        'v1.states.index' => [
            'id',
            'name',
            'description',
            'code',
            'color',
            'order',
            'created_at',
            'updated_at'
        ],
        'v1.offices.index' => [
            'id',
            'name',
            'initials',
            'parent',
            'level',
            'state_id',
            'created_at',
            'updated_at'
        ],
        'v1.users.index' => [
            'id',
            'first_name',
            'last_name',
            'phone_number',
            'identity_card',
            'issued_by',
            'username',
            'email',
            'office_location_id',
            'office_name',
            'office_initials',
            'place_name',
            'state_id',
            'created_at',
            'updated_at'
        ],
        'v1.permissions.index' => [
            'id',
            'name',
            'guard',
            'state_id',
            'created_at',
            'updated_at'
        ],
        'v1.roles.index' => [
            'id',
            'name',
            'guard',
            'state_id',
            'created_at',
            'updated_at'
        ],
        'v1.staff.index' => [
            'id',
            'first_name',
            'last_name',
            'phone_number',
            'identity_card',
            'issued_by',
            'other_phone_number',
            'office_phone_number',
            'place_id',
            'position_id',
            'office_id',
            'state_id',
            'created_at',
            'updated_at'
        ],
        'v1.menus.index' => [
            'id',
            'label',
            'route',
            'parent',
            'icon',
            'state_id',
            'created_at',
            'updated_at'
        ],
        'v1.motives.index' => [
            'id',
            'name',
            'description',
            'state_id',
            'created_at',
            'updated_at'
        ],
        'v1.note_types.index' => [
            'id',
            'name',
            'description',
            'state_id',
            'created_at',
            'updated_at'
        ],
        'v1.increase_types.index' => [
            'id',
            'name',
            'description',
            'state_id',
            'created_at',
            'updated_at'
        ],
        'v1.positions.index' => [
            'id',
            'name',
            'description',
            'state_id',
            'created_at',
            'updated_at'
        ],
        'v1.audits.index' => [
            'id',
            'user_type',
            'user_id',
            'event',
            'auditable_type',
            'auditable_id',
            'old_values',
            'new_values',
            'url',
            'ip_address',
            'user_agent',
            'tags',
            'created_at',
            'updated_at'
        ],
        'v1.historic_exchange_rates.index' => [
            'id',
            'exchange_rate',
            'exchange_rate_date',
            'ufv',
            'state_id',
            'created_at',
            'updated_at'
        ],
        'v1.historic_changes.index' => [
            'id',
            'ufv',
            'date',
            'state_id',
            'created_at',
            'updated_at'
        ],
        'v1.correlatives.index' => [
            'id',
            'description',
            'limit_date',
            'current_number',
            'state_id',
            'created_at',
            'updated_at'
        ],
        'v1.historic_note_details.index' => [
            'id',
            'note_id',
            'income_note_id',
            'payment_voucher',
            'expense_voucher',
            'voucher',
            'fdm_amount',
            'fdm_date',
            'state_id',
            'created_at',
            'updated_at'
        ],
        'v1.historic_increments.index' => [
            'id',
            'item_id',
            'date',
            'description',
            'is_active',
            'state_id',
            'created_at',
            'updated_at'
        ],
        'v1.historic_regs.index' => [
            'id',
            'ni',
            'cp',
            'ce',
            'cc',
            'state_id',
            'created_at',
            'updated_at'
        ],
        'v1.enterprise_rubrics.index' => [
            'id',
            'description',
            'state_id',
            'created_at',
            'updated_at'
        ],
        'v1.enterprises.index' => [
            'id',
            'name',
            'initials',
            'branch_name',
            'address',
            'country',
            'phone_number',
            'other_phone_number',
            'email',
            'representative_name',
            'contact_name',
            'state_id',
            'enterprise_rubric_id',
            'created_at',
            'updated_at'
        ],
        'v1.budget_rubrics.index' => [
            'id',
            'rubric',
            'description',
            'lifespan',
            'is_depreciated',
            'state_id',
            'created_at',
            'updated_at'
        ],
        'v1.item_groups.index' => [
            'id',
            'item_description',
            'item_group_type_id',
            'alphanumeric_code',
            'item_group_description',
            'material',
            'type',
            'is_intangible',
            'useful_months',
            'state_id',
            'budget_rubric_id',
            'created_at',
            'updated_at'
        ],
        'v1.funding_sources.index' => [
            'id',
            'code',
            'description',
            'abbreviation',
            'year',
            'state_id',
            'created_at',
            'updated_at'
        ],
        'v1.summaries.index' => [
            'id',
            'rubric',
            'accumulated_depreciation',
            'acquisition_cost',
            'asset_cost',
            'current_cost',
            'annual_depreciation',
            'current_depreciation',
            'total_accumulated_depreciation',
            'net_value',
            'state_id',
            'created_at',
            'updated_at'
        ],
        'v1.funding_organizations.index' => [
            'id',
            'code',
            'description',
            'abbreviation',
            'year',
            'state_id',
            'created_at',
            'updated_at'
        ],
        'v1.reports.index' => [
            'id',
            'description',
            'title',
            'state_id',
            'created_at',
            'updated_at'
        ],
        'v1.documents.index' => [
            'id',
            'item_id',
            'year',
            'original_value',
            'date',
            'useful_months',
            'state_id',
            'created_at',
            'updated_at'
        ],
        'v1.places.index' => [
            'id',
            'code',
            'description',
            'details',
            'abbreviation',
            'state_id',
            'created_at',
            'updated_at' // Corregido 'details' a 'description2' y añadido 'abbreviation'
        ],
        'v1.plates.index' => [
            'id',
            'description',
            'item_id',
            'serie',
            'state_id',
            'created_at',
            'updated_at' 
        ],
        'v1.income_notes.index' => [
            'id',
            'note',
            'payment_receipt',
            'expense_receipt',
            'voucher_number',
            'dfm_amount',
            'dfm_date',
            'state_id',
            'created_at',
            'updated_at' 
        ],
        'v1.office_locations.index' => [
            'id',
            'office_id',
            'place_id',
            'latitude',
            'longitude',
            'state_id',
            'created_at',
            'updated_at' 
        ],

        // Añade aquí las otras rutas que necesiten ordenación y sus columnas permitidas
    ]
];
