<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $rewrite->resume->user->name }} - Modern</title>
    <style>
        @page { margin: 0; }
        body {
            font-family: {{ $rewrite->style_config['fontFamily'] == 'serif' ? "'Times New Roman', serif" : ($rewrite->style_config['fontFamily'] == 'mono' ? "'Courier New', monospace" : "'Helvetica', 'Arial', sans-serif") }};
            color: #1e293b;
            line-height: 1.5;
            margin: 0;
            padding: 0;
            background-color: {{ $rewrite->style_config['backgroundColor'] ?? '#ffffff' }};
        }
        .container { padding: 60px; }
        .header { text-align: center; margin-bottom: 50px; }
        .profile-img { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 15px; border: 3px solid {{ $rewrite->style_config['primaryColor'] ?? '#4f46e5' }}; }
        .name { font-size: 32px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin: 0; color: #0f172a; }
        .contact { font-size: 10px; color: #64748b; margin-top: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
        .section { margin-bottom: 40px; }
        .section-title { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 3px; color: {{ $rewrite->style_config['primaryColor'] ?? '#4f46e5' }}; margin-bottom: 20px; text-align: center; }
        .summary { font-size: 14px; text-align: center; color: #475569; max-width: 90%; margin: 0 auto; }
        .exp-item { margin-bottom: 30px; }
        .exp-role { font-size: 16px; font-weight: 800; color: #0f172a; }
        .exp-company { font-size: 12px; font-weight: 700; color: {{ $rewrite->style_config['primaryColor'] ?? '#4f46e5' }}; text-transform: uppercase; margin: 2px 0; }
        .exp-ach { font-size: 13px; color: #475569; margin-top: 8px; }
        .skill-list { text-align: center; }
        .skill-tag { display: inline-block; background: {{ $rewrite->style_config['primaryColor'] ?? '#4f46e5' }}; color: white; padding: 4px 12px; border-radius: 4px; margin: 4px; font-size: 11px; font-weight: 800; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            @if($rewrite->profile_image)
                <img src="{{ public_path('storage/' . $rewrite->profile_image) }}" class="profile-img">
            @endif
            <h1 class="name">{{ $rewrite->resume->user->name }}</h1>
            <div class="contact">
                {{ $rewrite->contact_details['email'] ?? $rewrite->resume->user->email }} 
                @if(isset($rewrite->contact_details['phone'])) | {{ $rewrite->contact_details['phone'] }} @endif
                @if(isset($rewrite->contact_details['location'])) | {{ $rewrite->contact_details['location'] }} @endif
            </div>
        </div>

        <div class="section">
            <div class="section-title">Introduction</div>
            <p class="summary">{{ $rewrite->summary }}</p>
        </div>

        <div class="section">
            <div class="section-title">Experience</div>
            @foreach($rewrite->experience as $item)
                <div class="exp-item">
                    <div class="exp-role">{{ $item['role'] }}</div>
                    <div class="exp-company">{{ $item['company'] }} | {{ $item['duration'] }}</div>
                    <div class="exp-ach">
                        @foreach($item['achievements'] as $ach)
                            • {{ $ach }}<br>
                        @endforeach
                    </div>
                </div>
            @endforeach
        </div>

        <div class="section">
            <div class="section-title">Skills & Expertise</div>
            <div class="skill-list">
                @foreach($rewrite->skills as $skill)
                    <span class="skill-tag">{{ $skill }}</span>
                @endforeach
            </div>
        </div>
    </div>
</body>
</html>
